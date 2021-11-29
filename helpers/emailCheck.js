const emailCheck = (email) => {
  const queryString = `SELECT * FROM users
  WHERE email = $1`;
  const values = [email];
  return db
    .query(queryString, values)
    .then((data) => {
      if (data.rows[0] === undefined) {
        return (data.rows = null);
      }
      if (data.rows[0].email.toLowerCase() === email.toLowerCase()) {
        return data.rows[0];
      }
    })
    .catch((err) => {
      console.error({ error: err.message });
    });
};

module.exports = { emailCheck };
