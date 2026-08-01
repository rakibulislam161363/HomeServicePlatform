import { Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ITechnicianProfilePayload, ITechnicianQuery } from "./technician.interface";

const getAllTechnicians = async (query: ITechnicianQuery) => {
  const {
    search,
    location,
    minRating,
    page = "1",
    limit = "10",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const where: any = {
    role: Role.TECHNICIAN,
    status: UserStatus.ACTIVE,
  };

  // Search by technician name
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Technician profile filters
  if (location || minRating) {
    where.technicianProfile = {
      is: {
        ...(location && {
          address: {
            contains: location,
            mode: "insensitive",
          },
        }),

        ...(minRating && {
          rating: {
            gte: Number(minRating),
          },
        }),
      },
    };
  }

  const [technicians, total] = await Promise.all([
    prisma.user.findMany({
      where,

      omit: {
        password: true,
      },

      include: {
        technicianProfile: true,

        services: {
          include: {
            category: true,
          },
        },
      },

      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
    data: technicians,
  };
};

const getTechnicianById = async (id: string) => {
  const technician = await prisma.user.findFirst({
    where: {
      id,
      role: Role.TECHNICIAN,
      status: UserStatus.ACTIVE,
    },

    omit: {
      password: true,
    },

    include: {
      technicianProfile: true,

      services: {
        include: {
          category: true,
        },
      },

      technicianReviews: true,
    },
  });

  if (!technician) {
    throw new Error("Technician not found");
  }

  return technician;
};
const getMyProfile = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },

    include: {
      user: {
        omit: {
          password: true,
        },

        include: {
          services: {
            include: {
              category: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  return profile;
};

const createMyProfile = async (
  userId: string,
  payload: ITechnicianProfilePayload
) => {
  const existingProfile =
    await prisma.technicianProfile.findUnique({
      where: {
        userId,
      },
    });

  if (existingProfile) {
    throw new Error("Technician profile already exists");
  }

  const profile = await prisma.technicianProfile.create({
    data: {
      userId,
      bio: payload.bio,
      experience: payload.experience,
      address: payload.address,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return profile;
};

const updateMyProfile = async (
  userId: string,
  payload: Partial<ITechnicianProfilePayload>
) => {
  const profile =
    await prisma.technicianProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!profile) {
    throw new Error("Technician profile not found");
  }

  const updatedProfile =
    await prisma.technicianProfile.update({
      where: {
        userId,
      },
      data: payload,
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

  return updatedProfile;
};

export const technicianService = {
  getAllTechnicians,
  getTechnicianById,
  getMyProfile,
  createMyProfile,
  updateMyProfile
};