/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("blitz_games", {
    id: { type: "serial", primaryKey: true },
    white_player_id: { type: "text", notNull: true },
    black_player_id: { type: "text", notNull: true },
    fen: { type: "text", notNull: true, default: "startpos" }, // Default starting position
    moves: { type: "jsonb", notNull: true, default: "[]" },
    status: { type: "text", notNull: true, default: "waiting" }, // waiting, ongoing, completed, abandoned
    winner: { type: "text", default: null }, // null means not finished yet
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("blitz_games");
};
