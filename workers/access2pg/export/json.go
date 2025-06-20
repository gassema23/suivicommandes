// Export vers JSON
package export

import (
	"encoding/json"
	"fmt"
	"os"
)

func ExportToJSON(headers []string, rows [][]string, outputFile string) error {
	var data []map[string]string

	for _, row := range rows {
		obj := make(map[string]string)
		for i, val := range row {
			if i < len(headers) {
				obj[headers[i]] = val
			}
		}
		data = append(data, obj)
	}

	file, err := os.Create(outputFile)
	if err != nil {
		return fmt.Errorf("unable to create output file: %v", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	return encoder.Encode(data)
}
