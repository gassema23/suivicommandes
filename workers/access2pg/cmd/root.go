package cmd

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "access2pg",
	Short: "Outil CLI pour extraire des données Access et les exporter",
	Long:  `Cet outil vous permet d'extraire une table Access (.accdb) et de l'exporter vers un fichier JSON.`,
}

func Execute() {
	cobra.CheckErr(rootCmd.Execute())
}
