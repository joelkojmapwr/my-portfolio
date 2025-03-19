addNIVShortcut(){
    this.addCommand({
      id: "NIV",
      name: "biblia_NIV",
      callback: async () => {
        EventStats.logUIOpen(
          "Biblia NIV",
          { key: `command-lookup`, value: 1 },
          this.settings.optOutToEvents
        );
        var value = "niv2011";
        this.settings.bibleVersion = value;
        console.debug("Default Bible Version: " + value);
        await this.saveSettings();
        pluginEvent.trigger("bible-reference:settings:version", [value]);
        new import_obsidian2.Notice(`Bible Reference - use Version ${value.toUpperCase()}`);
        EventStats.logSettingChange(
          "changeVersion",
          { key: value, value: 1 },
          this.settings.optOutToEvents
        );
        
      }
    })
}