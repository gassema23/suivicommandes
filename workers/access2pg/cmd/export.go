package cmd

import (
	 "bytes" 
    "encoding/csv"
    "encoding/json"
    "fmt"
    "log"
    "os"
    "os/exec"

    "github.com/spf13/cobra"
)

var exportCmd = &cobra.Command{
    Use:   "export",
    Short: "Export une table Access au format JSON",
    Run: func(cmd *cobra.Command, args []string) {
        dbFile, _ := cmd.Flags().GetString("db")
        tableName, _ := cmd.Flags().GetString("table")
        outputFile, _ := cmd.Flags().GetString("output")

        if dbFile == "" || tableName == "" || outputFile == "" {
            log.Fatalf("Les flags --db, --table et --output sont obligatoires")
        }

        // Utilise mdb-export pour exporter la table en CSV
        cmdExport := exec.Command("mdb-export", dbFile, tableName)
        csvData, err := cmdExport.Output()
        if err != nil {
            log.Fatalf("Erreur lors de l'export CSV : %v", err)
        }

        r := csv.NewReader(bytes.NewReader(csvData))
        records, err := r.ReadAll()
        if err != nil {
            log.Fatalf("Erreur lecture CSV : %v", err)
        }
        if len(records) < 1 {
            log.Fatalf("La table %s est vide ou n'existe pas", tableName)
        }

        headers := records[0]
        var data []map[string]string

        for _, row := range records[1:] {
            if len(row) != len(headers) {
                log.Printf("Ligne ignorée (nombre de colonnes différent) : %v", row)
                continue
            }
            item := make(map[string]string)
            for i, h := range headers {
                item[h] = row[i]
            }
            data = append(data, item)
        }

        jsonData, err := json.MarshalIndent(data, "", "  ")
        if err != nil {
            log.Fatalf("Erreur lors du formatage JSON : %v", err)
        }

        err = os.WriteFile(outputFile, jsonData, 0644)
        if err != nil {
            log.Fatalf("Erreur écriture fichier JSON : %v", err)
        }

        fmt.Printf("Export réussi dans %s\n", outputFile)
    },
}

func init() {
    exportCmd.Flags().StringP("db", "d", "", "Fichier de base de données Access (.accdb)")
    exportCmd.Flags().StringP("table", "t", "", "Nom de la table à exporter")
    exportCmd.Flags().StringP("output", "o", "", "Fichier JSON de sortie")
    rootCmd.AddCommand(exportCmd)
}
