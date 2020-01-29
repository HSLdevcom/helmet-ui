import React from 'react';
import path from "path";

const Settings = () => {
  return (
    <div className="Settings">

      <div className="Settings__overlay">{/* Dark background overlay */}</div>

      <div className="Settings__dialog">
        <div className="Settings__dialog-heading">Asetukset</div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Emme Python</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-emme-python-path">
            {this.props.emme_python_path ? path.basename(this.props.emme_python_path) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-emme-python-path"
                 type="file"
                 accept=".exe"
                 onChange={(e) => this.props.setEMMEPythonPath(e.target.files[0].path)}
          />
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Helmet Scripts</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-helmet-scripts-path">
            {this.props.helmet_scripts_path ? path.basename(this.props.helmet_scripts_path) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-helmet-scripts-path"
                 type="file"
                 webkitdirectory=""
                 directory=""
                 onChange={(e) => this.props.setHelmetScriptsPath(e.target.files[0].path)}
          />
        </div>
        <div className="Settings__dialog-controls">
          <button onClick={(e) => this.props.closeSettings()}>
            Sulje
          </button>
        </div>
      </div>

    </div>
  )
};
