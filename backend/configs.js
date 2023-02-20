module.exports = {
  CONNECTION_CONFIG: {
    host: process.env.MYSQL_HOST_IP,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  JWT_SECRET: '1r5eITvCUmlTlsJEbV?hBLxWryP83FqOSxP-nMcaGeIH=hIXgkrN0vEvp/vORKweMmTJPp/r0/U/yFJcw6CMH5lFPe2k3qb/xgU',
  MAILTRAP_CONFIG: {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "YOUR_MAILTRAP_USER",
      pass: "YOUR_MAILTRAP_PASS"
    }
  },
  MAIL_OPTIONS: {
    from: 'instructor@test.com',
    subject: 'Your Assignment is graded!',
  }
};
