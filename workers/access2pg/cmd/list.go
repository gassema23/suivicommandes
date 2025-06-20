package cmd

import (
	"bytes"
	"fmt"
	"log"
	"os/exec"

	"github.com/spf13/cobra"
)

var dbToList string

func init() {
	listCmd := &cobra.Command{
		Use:   "list",
		Short: "Lister les tables disponibles dans une base Access",
		Run:   runList,
	}

	listCmd.Flags().StringVarP(&dbToList, "db", "d", "", "Chemin vers le fichier Access (.accdb)")
	listCmd.MarkFlagRequired("db")

	rootCmd.AddCommand(listCmd)
}

func runList(cmd *cobra.Command, args []string) {
	var out bytes.Buffer
	command := exec.Command("mdb-tables", "-1", dbToList) // -1 pour une table par ligne
	command.Stdout = &out

	err := command.Run()
	if err != nil {
		log.Fatalf("Erreur avec mdb-tables : %v", err)
	}

	lines := bytes.Split(out.Bytes(), []byte("\n"))

	fmt.Printf("✅ Tables disponibles dans %s :\n", dbToList)
	for _, line := range lines {
		if len(line) > 0 {
			fmt.Printf("- %s\n", line)
		}
	}
}
