package cmd

import (
	"bufio"
	"bytes"
	"fmt"
	"log"
	"os/exec"
	"regexp"
	"strings"

	"github.com/spf13/cobra"
)

var (
	dbToDescribe    string
	tableToDescribe string
)

func init() {
	describeCmd := &cobra.Command{
		Use:   "describe",
		Short: "Lister les colonnes d'une table Access",
		Run:   runDescribe,
	}

	describeCmd.Flags().StringVarP(&dbToDescribe, "db", "d", "", "Chemin vers le fichier Access (.accdb)")
	describeCmd.Flags().StringVarP(&tableToDescribe, "table", "t", "", "Nom de la table à décrire")

	describeCmd.MarkFlagRequired("db")
	describeCmd.MarkFlagRequired("table")

	rootCmd.AddCommand(describeCmd)
}

func runDescribe(cmd *cobra.Command, args []string) {
	cmdSchema := exec.Command("mdb-schema", dbToDescribe, "sqlite")
	var out bytes.Buffer
	cmdSchema.Stdout = &out

	err := cmdSchema.Run()
	if err != nil {
		log.Fatalf("Erreur lors de l'extraction du schéma : %v", err)
	}

	targetTableLower := strings.ToLower(tableToDescribe)

	scanner := bufio.NewScanner(&out)
	var capture bool
	var createLines []string

	for scanner.Scan() {
		line := scanner.Text()
		lineLower := strings.ToLower(line)

		if !capture {
			if strings.Contains(lineLower, "create table") && strings.Contains(lineLower, "`"+targetTableLower+"`") {
				capture = true
				createLines = append(createLines, line)
			}
		} else {
			createLines = append(createLines, line)
			if strings.HasSuffix(strings.TrimSpace(line), ");") {
				break
			}
		}
	}

	if len(createLines) == 0 {
		log.Fatalf("Table '%s' non trouvée dans le schéma.", tableToDescribe)
	}

	fmt.Printf("Colonnes de la table '%s':\n", tableToDescribe)

	// Extraction plus tolérante des colonnes
	colRe := regexp.MustCompile("`([^`]+)`\\s+([^,\\s]+)")

	for _, line := range createLines[1 : len(createLines)-1] {
		matches := colRe.FindStringSubmatch(line)
		if len(matches) == 3 {
			colName := matches[1]
			colType := matches[2]
			fmt.Printf("- %s (%s)\n", colName, colType)
		}
	}
}

