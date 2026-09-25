import { parentPort, workerData } from "worker_threads";
import XLSX from "xlsx";

import { connectDatabase, disconnectDatabase } from "../config/database.js";

import { Agent } from "../models/Agent.js";
import { User } from "../models/User.js";
import { Account } from "../models/Account.js";
import { Lob } from "../models/Lob.js";
import { Carrier } from "../models/Carrier.js";
import { Policy } from "../models/Policy.js";

const getUniqueValues = (rows, field) => {
  return [
    ...new Set(
      rows
        .map((row) => row[field])
        .filter((value) => value !== undefined && value !== null && value !== "")
    ),
  ];
};

const createAgentRecords = async (rows) => {
  const uniqueAgents = getUniqueValues(rows, "agent");

  await Agent.bulkWrite(
    uniqueAgents.map((agentName) => ({
      updateOne: {
        filter: { agentName },
        update: {
          $setOnInsert: {
            agentName,
          },
        },
        upsert: true,
      },
    }))
  );

  const agents = await Agent.find({
    agentName: { $in: uniqueAgents },
  }).lean();

  const agentMap = new Map(
    agents.map((agent) => [agent.agentName, agent._id])
  );

  return {
    count: uniqueAgents.length,
    agentMap,
  };
};

const createLobRecords = async (rows) => {
  const uniqueCategories = getUniqueValues(
    rows,
    "category_name"
  );

  await Lob.bulkWrite(
    uniqueCategories.map((categoryName) => ({
      updateOne: {
        filter: { categoryName },
        update: {
          $setOnInsert: {
            categoryName,
          },
        },
        upsert: true,
      },
    }))
  );

  const lobs = await Lob.find({
    categoryName: { $in: uniqueCategories },
  }).lean();

  const lobMap = new Map(
    lobs.map((lob) => [lob.categoryName, lob._id])
  );

  return {
    count: uniqueCategories.length,
    lobMap,
  };
};

const createCarrierRecords = async (rows) => {
  const uniqueCompanies = getUniqueValues(
    rows,
    "company_name"
  );

  await Carrier.bulkWrite(
    uniqueCompanies.map((companyName) => ({
      updateOne: {
        filter: { companyName },
        update: {
          $setOnInsert: {
            companyName,
          },
        },
        upsert: true,
      },
    }))
  );

  const carriers = await Carrier.find({
    companyName: { $in: uniqueCompanies },
  }).lean();

  const carrierMap = new Map(
    carriers.map((carrier) => [
      carrier.companyName,
      carrier._id,
    ])
  );

  return {
    count: uniqueCompanies.length,
    carrierMap,
  };
};

const createUserRecords = async (rows, agentMap) => {
  const userMapByEmail = new Map();

  for (const row of rows) {
    const email = row.email?.trim().toLowerCase();

    if (!email || userMapByEmail.has(email)) {
      continue;
    }

    userMapByEmail.set(email, row);
  }

  const userOperations = Array.from(userMapByEmail.values()).map(
    (row) => {
      const email = row.email.trim().toLowerCase();

      return {
        updateOne: {
          filter: { email },
          update: {
            $set: {
                firstName: row.firstname,
                dob: row.dob,
                address: row.address,
                city: row.city,
                phone: row.phone,
                state: row.state,
                zipCode: row.zip,
                email,
                gender: row.gender,
                userType: row.userType,
                agentId: agentMap.get(row.agent),
            },
           },
          upsert: true,
        },
      };
    }
  );

  if (userOperations.length > 0) {
    await User.bulkWrite(userOperations);
  }

  const emails = [...userMapByEmail.keys()];

  const users = await User.find({
    email: { $in: emails },
  }).lean();

  const userMap = new Map(
    users.map((user) => [user.email, user._id])
  );

  return {
    count: users.length,
    userMap,
  };
};

const createAccountRecords = async (rows, userMap) => {
  const accountMap = new Map();

  for (const row of rows) {
    const email = row.email?.trim().toLowerCase();
    const userId = userMap.get(email);

    if (!row.account_name || !userId) {
      continue;
    }

    const accountName = row.account_name.trim();
    const key = `${userId}:${accountName}`;

    if (!accountMap.has(key)) {
      accountMap.set(key, {
        accountName,
        userId,
      });
    }
  }

  const accountOperations = Array.from(accountMap.values()).map(
    ({ accountName, userId }) => ({
      updateOne: {
        filter: {
          accountName,
          userId,
        },
        update: {
          $set: {
            accountName,
            userId,
          },
        },
        upsert: true,
      },
    })
  );

  if (accountOperations.length > 0) {
    await Account.bulkWrite(accountOperations);
  }

  return accountOperations.length;
};

const createPolicyRecords = async (
  rows,
  userMap,
  carrierMap,
  lobMap
) => {
  const policyMap = new Map();

  for (const row of rows) {
    const policyNumber = row.policy_number?.trim();

    if (!policyNumber) {
      continue;
    }

    const email = row.email?.trim().toLowerCase();
    const userId = userMap.get(email);
    const companyId = carrierMap.get(row.company_name);
    const categoryId = lobMap.get(row.category_name);

    if (!userId || !companyId || !categoryId) {
      continue;
    }

    if (!policyMap.has(policyNumber)) {
      policyMap.set(policyNumber, {
        policyNumber,
        startDate: row.policy_start_date,
        endDate: row.policy_end_date,
        userId,
        companyId,
        categoryId,
      });
    }
  }

  const policyOperations = Array.from(policyMap.values()).map(
    (policy) => ({
      updateOne: {
        filter: {
          policyNumber: policy.policyNumber,
        },
        update: {
          $set: policy,
        },
        upsert: true,
      },
    })
  );

  if (policyOperations.length > 0) {
    await Policy.bulkWrite(policyOperations);
  }

  return policyOperations.length;
};

const parseFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("Uploaded file does not contain a worksheet");
  }

  const worksheet = workbook.Sheets[firstSheetName];

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
  });
};

const importData = async () => {
  await connectDatabase();

  const rows = parseFile(workerData.filePath);

  if (!rows.length) {
    throw new Error("Uploaded file contains no data");
  }

  const { count: agentCount, agentMap } =
    await createAgentRecords(rows);

  const { count: lobCount, lobMap } =
    await createLobRecords(rows);

  const { count: carrierCount, carrierMap } =
    await createCarrierRecords(rows);

  const { count: userCount, userMap } =
    await createUserRecords(rows, agentMap);

  await createAccountRecords(rows, userMap);

  const policyCount = await createPolicyRecords(
    rows,
    userMap,
    carrierMap,
    lobMap
  );

  parentPort.postMessage({
    success: true,
    message: "File imported successfully",
    summary: {
      totalRows: rows.length,
      agents: agentCount,
      users: userCount,
      categories: lobCount,
      companies: carrierCount,
      policies: policyCount,
    },
  });
};

const runImport = async () => {
  try {
    await importData();
  } catch (error) {
    parentPort.postMessage({
      success: false,
      message: error.message,
    });
  } finally {
    await disconnectDatabase();
  }
};

runImport();