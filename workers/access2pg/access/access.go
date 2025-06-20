// Accès à la base Access via mdbtools
package access

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"os/exec"
)

func ReadTable(dbPath, tableName string) ([][]string, error) {
	cmd := exec.Command("mdb-export", dbPath, tableName)
	var out bytes.Buffer
	cmd.Stdout = &out

	err := cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("mdb-export error: %v", err)
	}

	reader := csv.NewReader(&out)
	return reader.ReadAll()
}
