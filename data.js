const { Client } = require('pg');
const ExcelJS = require('exceljs');

(async () => {
  const client = new Client({
    host: '104.248.60.94',
    port: 5432,
    user: 'sysnet',
    password: 'Sysnet4@@',
    database: 'db_apm',
  });

  await client.connect();

  const query = `
    SELECT
      p.id,
      p.plate,
      p.status,
      p.imei,
      p.gps_brand,
      p.gps_model,
      p.gps_technology,
      p.installation_date,
      p.gps_age,
      p.sim_operator,
      p.monitoring_contact,
      p.contact_email,
      p.contact_phone,
      p.country,
      p.business,
      p.location,
      p.created_at,
      p.updated_at,
      p.last_track_at,

      pg.id   AS provider_gps_id,
      pg.name AS provider_gps_name,

      v.id          AS vendor_id,
      v.ruc         AS vendor_ruc,
      v.trade_name  AS vendor_trade_name,
      v.vendor_alias,
      v.code        AS vendor_code,
      v.priority
    FROM plates p
    LEFT JOIN provider_gps pg
      ON pg.id = p.id_provider_gps
    LEFT JOIN vendor v
      ON v.id = p.id_transport_vendor
    WHERE p.last_track_at IS NULL
    ORDER BY p.plate;
  `;

  const { rows } = await client.query(query);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Placas sin tracking');

  sheet.columns = [
    { header: 'Plate ID', key: 'id', width: 12 },
    { header: 'Plate', key: 'plate', width: 15 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'IMEI', key: 'imei', width: 18 },
    { header: 'GPS Brand', key: 'gps_brand', width: 15 },
    { header: 'GPS Model', key: 'gps_model', width: 15 },
    { header: 'GPS Technology', key: 'gps_technology', width: 18 },
    { header: 'Installation Date', key: 'installation_date', width: 18 },
    { header: 'GPS Age', key: 'gps_age', width: 10 },
    { header: 'SIM Operator', key: 'sim_operator', width: 15 },
    { header: 'Contact', key: 'monitoring_contact', width: 20 },
    { header: 'Email', key: 'contact_email', width: 25 },
    { header: 'Phone', key: 'contact_phone', width: 15 },
    { header: 'Country', key: 'country', width: 12 },
    { header: 'Business', key: 'business', width: 20 },
    { header: 'Location', key: 'location', width: 20 },
    { header: 'Created At', key: 'created_at', width: 20 },
    { header: 'Last Track At', key: 'last_track_at', width: 20 },

    { header: 'GPS Provider', key: 'provider_gps_name', width: 20 },

    { header: 'Vendor RUC', key: 'vendor_ruc', width: 15 },
    { header: 'Vendor Name', key: 'vendor_trade_name', width: 22 },
    { header: 'Vendor Alias', key: 'vendor_alias', width: 20 },
    { header: 'Vendor Code', key: 'vendor_code', width: 15 },
    { header: 'Vendor Priority', key: 'priority', width: 10 },
  ];

  rows.forEach(row => sheet.addRow(row));

  await workbook.xlsx.writeFile('placas_sin_last_track.xlsx');

  await client.end();

  console.log('✅ Excel generado: placas_sin_last_track.xlsx');
})();
