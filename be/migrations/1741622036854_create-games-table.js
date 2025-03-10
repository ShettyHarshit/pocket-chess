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
  pgm.createTable("games", {
    id: "id",
    fen: { type: "text", notNull: true },
    moves: { type: "jsonb", notNull: true, default: "[]" },
    result: { type: "text" },
    created_at: { type: "timestamp", default: pgm.func("CURRENT_TIMESTAMP") },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

exports.down = (pgm) => {
  pgm.dropTable("games");
};
