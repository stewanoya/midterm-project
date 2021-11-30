const emailCheck = (email, db) => {
  const queryString = `SELECT * FROM users
  WHERE email = $1`;
  const queryValues = [email];
  // db query to return data if the email exists
  return db
    .query(queryString, queryValues)
    .then((data) => {
      // set data to null if query returns empty array
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

module.exports = emailCheck;
