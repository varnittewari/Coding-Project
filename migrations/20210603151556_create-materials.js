
exports.up = function(knex) {
  return knex.schema.createTable("materials", function (table) {
      table.uuid("id").primary();
      table.string("name").nullable();
      table.float("volume").unsigned();
      table.float("cost_per_cubic_meter").unsigned();
      table.string("color");
      table.date("delivery_date").nullable();
      table.uuid("construction_site_id");
      table.foreign("construction_site_id").references("construction_sites.id");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("materials");
};
