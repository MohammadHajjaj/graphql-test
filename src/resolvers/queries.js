const Query = {
  users: (_parent, args, context) => context.prisma.user.findMany(),
};

module.exports = Query;
