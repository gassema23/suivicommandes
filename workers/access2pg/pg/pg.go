// Connexion et insertion dans PostgreSQL

package pg

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

func Connect(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	return db, db.Ping()
}

func InsertRows(db *sql.DB, table string, headers []string, rows [][]string) error {
	for _, row := range rows {
		placeholders := ""
		values := []interface{}{}
		for i, val := range row {
			placeholders += fmt.Sprintf("$%d,", i+1)
			values = append(values, val)
		}
		placeholders = placeholders[:len(placeholders)-1] // remove trailing comma

		query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)",
			table,
			join(headers, ","),
			placeholders,
		)
		_, err := db.Exec(query, values...)
		if err != nil {
			return err
		}
	}
	return nil
}

func join(arr []string, sep string) string {
	out := ""
	for i, val := range arr {
		if i > 0 {
			out += sep
		}
		out += val
	}
	return out
}
