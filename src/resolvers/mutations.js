const bcrypt = require("bcryptjs");
const Mutation = {
  createUser: async (_parent, { data }, context) => {
    const user = await context.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
      },
    });
    return user;
  },
  login: async (_parent, { data }, context) => {
    const user = await context.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    const valid = user && (await bcrypt.compare(data.password, user.password));

    if (!valid) {
      throw new Error("Incorrect email or password");
    }

    return user;
  },
};

module.exports = Mutation;
