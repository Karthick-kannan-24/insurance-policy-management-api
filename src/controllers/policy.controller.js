import { User } from "../models/User.js";
import { Policy } from "../models/Policy.js";
import { Account } from "../models/Account.js";
import { Agent } from "../models/Agent.js";
import { Carrier } from "../models/Carrier.js";
import { Lob } from "../models/Lob.js";

export const searchPolicyByUsername = async (req, res, next) => {
  try {
    const { username } = req.query;

    if (!username?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const searchValue = username.trim();

    // Search user by first name or email
    const user = await User.findOne({
      $or: [
        {
          firstName: {
            $regex: `^${searchValue}$`,
            $options: "i",
          },
        },
        {
          email: searchValue.toLowerCase(),
        },
      ],
    }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find all policies for the user
    const policies = await Policy.find({
      userId: user._id,
    })
      .populate({
        path: "companyId",
        model: Carrier,
        select: "companyName",
      })
      .populate({
        path: "categoryId",
        model: Lob,
        select: "categoryName",
      })
      .lean();

    // Find user's account
    const account = await Account.findOne({
      userId: user._id,
    }).lean();

    // Find user's agent
    const agent = user.agentId
      ? await Agent.findById(user.agentId).lean()
      : null;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
          gender: user.gender,
          userType: user.userType,
          dob: user.dob,
        },

        account: account
          ? {
              id: account._id,
              accountName: account.accountName,
            }
          : null,

        agent: agent
          ? {
              id: agent._id,
              agentName: agent.agentName,
            }
          : null,

        policies: policies.map((policy) => ({
          id: policy._id,
          policyNumber: policy.policyNumber,
          startDate: policy.startDate,
          endDate: policy.endDate,

          carrier: policy.companyId
            ? {
                id: policy.companyId._id,
                companyName: policy.companyId.companyName,
              }
            : null,

          category: policy.categoryId
            ? {
                id: policy.categoryId._id,
                categoryName: policy.categoryId.categoryName,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
export const aggregatePoliciesByUser = async (req, res, next) => {
  try {
    const result = await Policy.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "agents",
          localField: "user.agentId",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: {
          path: "$agent",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "user._id",
          foreignField: "userId",
          as: "account",
        },
      },
      {
        $unwind: {
          path: "$account",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "carriers",
          localField: "companyId",
          foreignField: "_id",
          as: "carrier",
        },
      },
      {
        $unwind: {
          path: "$carrier",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "lobs",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$user._id",

          user: {
            $first: {
              firstName: "$user.firstName",
              email: "$user.email",
              phone: "$user.phone",
              address: "$user.address",
              city: "$user.city",
              state: "$user.state",
              zipCode: "$user.zipCode",
              gender: "$user.gender",
              userType: "$user.userType",
              dob: "$user.dob",
            },
          },

          agent: {
            $first: {
              id: "$agent._id",
              agentName: "$agent.agentName",
            },
          },

          account: {
            $first: {
              id: "$account._id",
              accountName: "$account.accountName",
            },
          },

          policies: {
            $push: {
              id: "$_id",
              policyNumber: "$policyNumber",
              startDate: "$startDate",
              endDate: "$endDate",

              carrier: {
                id: "$carrier._id",
                companyName: "$carrier.companyName",
              },

              category: {
                id: "$category._id",
                categoryName: "$category.categoryName",
              },
            },
          },

          policyCount: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "user.firstName": 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};