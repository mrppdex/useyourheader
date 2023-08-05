import React, { useState } from "react";
import "./App.css";  // Assuming you have an App.css file in the same folder

const HeaderGenerator = () => {
  const [companyName, setCompanyName] = useState("The Company Name");
  const [rootDirectory, setRootDirectory] = useState("");
  const [codePath, setCodePath] = useState("/cloud/production");
  const [codeName, setCodeName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [specificationPath, setSpecificationPath] = useState("/cloud/production");
  const [specificationFilename, setSpecificationFilename] = useState("");
  const [irPath, setIrPath] = useState("");
  const [irFilename, setIrFilename] = useState("");
  const [origPath, setOrigPath] = useState("");
  const [origFilename, setOrigFilename] = useState("");
  const [ccModules, setCcModules] = useState("");
  const [softver, setSoftver] = useState("");
  const [infra, setInfra] = useState("");
  const [version, setVersion] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [dataInputs, setDataInputs] = useState([]);
  const [dataInputsPath, setDataInputsPath] = useState("/cloud/production");
  const [dataOutputFilename, setDataOutputFilename] = useState("");
  const [dataOutputPath, setDataOutputPath] = useState("");
  const [dataOutputs, setDataOutputs] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [authorDescription, setAuthorDescription] = useState("");
  const [validatorName, setValidatorName] = useState("");
  const [validationDescription, setValidationDescription] = useState("");
  const [headerText, setHeaderText] = useState("");
  // R code to be copied
  const [rCode, setRCode] = useState(`pkgs <- sessionInfo()$otherPkgs
  names_and_versions <- data.frame(Package = names(pkgs), Version = unlist(lapply(pkgs, \`[[\`, "Version")))
  names_and_versions <- with(names_and_versions, paste(Package,Version))

  print(names_and_versions)

  copy_to_clipboard <- function(my_var) {

    # Determine the system type
    system_type <- Sys.info()["sysname"]

    if (system_type == "Windows") {
      # If the system is Windows, use writeClipboard
      writeClipboard(my_var)
    } else if (system_type == "Darwin") {
      # If the system is Mac (Darwin), use pbcopy
      pipe <- pipe("pbcopy", "w")
      cat(my_var, file = pipe)
      close(pipe)
    } else if (system_type == "Linux") {
      # If the system is Linux, use xclip or xsel
      pipe <- pipe("xclip -selection clipboard", "w")
      cat(my_var, file = pipe)
      close(pipe)
    } else {
      # For other systems
      print("Unknown system type. Cannot copy to clipboard.")
    }
  }

  copy_to_clipboard(names_and_versions)

  print("Go back to the header app and paste data from the clipboard")`);

  const handleRootDirectoryChange = (e) => {
    const newRootDirectory = e.target.value;
    setRootDirectory(newRootDirectory);
    setCodePath(newRootDirectory);
    setSpecificationPath(newRootDirectory);
    setIrPath(newRootDirectory);
    setOrigPath(newRootDirectory);
    setDataInputsPath(newRootDirectory);
    setDataOutputPath(newRootDirectory);
  };

  // Function to copy the R code to the clipboard
  const handleCopyRCode = () => {
    navigator.clipboard.writeText(rCode);
    alert("R code copied to clipboard. After running it, paste the output in the Component Code Modules field.");
  };


  const handleSpecificationFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSpecificationFilename(e.target.files[0].name);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCodeName(e.target.files[0].name);
    }
  };

  const handleIrFileChange = (e) => {
    if (e.target.files.length > 0) {
      setIrFilename(e.target.files[0].name);
    }
  };

  const handleOrigFileChange = (e) => {
    if (e.target.files.length > 0) {
      setOrigFilename(e.target.files[0].name);
    }
  };

  const handleDataInputFilesChange = (e) => {
    setDataInputs([...dataInputs, {path: dataInputsPath, files: Array.from(e.target.files, file => file.name)}]);
    e.target.value = null;  // Clear the file input
  };

  const handleDataOutputChange = (e) => {
    if (dataOutputFilename !== "") {
      setDataOutputs([...dataOutputs, { outputPath: dataOutputPath, outputFilename: dataOutputFilename }]);
      setDataOutputFilename("");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options).split('/').reverse().join('-');
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate the header text...
    const dataInputsText = dataInputs.map((dataInput, index) => {
      const fileListText = dataInput.files.map(fileName => `#                           > ${fileName}`).join('\n');
      const prefix = index === 0 ? '# DATA INPUT              :' : '#                          ';
      return `${prefix} CLOUD: ${dataInput.path || 'N/A'}\n${fileListText}`;
    }).join('\n');

    const dataOutputsText = [...dataOutputs, { outputPath: dataOutputPath, outputFilename: dataOutputFilename }]
      .filter((dataOutput) => dataOutput.outputFilename !== "")
      .map((dataOutput, index) => {
        const prefix = index === 0 ? '# DATA OUTPUT             :' : '#                          ';
        return `${prefix} CLOUD: ${dataOutput.outputPath || 'N/A'}/${dataOutput.outputFilename || 'N/A'}`;
      }).join('\n');

    handleDataOutputChange();
    
    const words = description.split(' ');
    let descriptionLines = [''];
    for (let word of words) {
      if ((descriptionLines[descriptionLines.length - 1] + ' ' + word).length <= 50) {
        descriptionLines[descriptionLines.length - 1] += ' ' + word;
      } else {
        descriptionLines.push(word);
      }
    }
    const descriptionText = descriptionLines.join('\n#                           ').trim();

    let ccModuleLines = ccModules.split('\n');
    const ccModuleText = ccModuleLines.join('\n#                           ').trim();

    const additionalInstructionsText = additionalInstructions.split('\n').join('\n#                           ').trim();

    const generatedHeaderText = `
# **soh*****************************************************************************
# ${companyName || 'N/A'}
# CODE NAME               : CLOUD: ${codePath}/${codeName || 'N/A'}
# PROJECT NAME            : ${projectName || 'N/A'}
# DESCRIPTION             : ${descriptionText || 'N/A'}
# SPECIFICATION           : CLOUD: ${specificationPath || 'N/A'}/${specificationFilename || 'N/A'}
# INDEPENDENT REPLICATION : ${irFilename ? `CLOUD: ${irPath}/${irFilename}` : 'N/A, this is a validation code'}
# ORIGINAL CODE           : ${origFilename ? `CLOUD: ${origPath}/${origFilename}` : 'N/A, this is an original code'}
# COMPONENT CORE MODULES  : ${ccModuleText || 'N/A'}
# SOFTWARE/VERSION#       : ${softver || 'N/A'}
# INFRASTRUCTURE          : ${infra || 'N/A'}
${dataInputsText || '# DATA INPUT              : N/A'}
${dataOutputsText || '# DATA OUTPUT             : N/A'}
# SPECIAL INSTRUCTIONS    : ${additionalInstructionsText || 'N/A'}
# ----------------------------------------------------------------------------------
# ----------------------------------------------------------------------------------
# DOCUMENTATION AND REVISION HISTORY SECTION:
#
# Ver# Date       Author & Validator       Code History Description
# ---- ---------- ------------------------ -----------------------------
# ${(version || 'N/A').padEnd(4,' ')} ${formatDate(creationDate)} ${(authorName || 'N/A').padEnd(24, ' ')} ${authorDescription || 'N/A'}
#                 ${(validatorName || 'N/A').padEnd(24, ' ')} ${validationDescription || 'N/A'}
# **eoh*****************************************************************************`;
    // Set the header text state to the generated text
    setHeaderText(generatedHeaderText);
  };

  const handleCopy = (e) => {
    navigator.clipboard.writeText(headerText);
  }

  return (
    <div className="app">
<form className="form" onSubmit={handleSubmit}>
        <h1>Header Generator</h1>
        <div className="form-group">
          <label>Company Name:</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Root Directory:</label>
          <input type="text" value={rootDirectory} onChange={handleRootDirectoryChange} />
        </div>
        <div className="form-group">
          <label>Code Path:</label>
          <input type="text" value={codePath} onChange={(e) => setCodePath(e.target.value)} />
          <label>Code Name:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Project Name:</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Specification Path:</label>
          <input type="text" value={specificationPath} onChange={(e) => setSpecificationPath(e.target.value)} />
          <label>Specification File:</label>
          <input type="file" onChange={handleSpecificationFileChange} />
        </div>
        <div className="form-group">
          <label>Independent Replication Path:</label>
          <input type="text" value={irPath} onChange={(e) => setIrPath(e.target.value)} />
          <label>Independent Replication Filename:</label>
          <input type="file" onChange={handleIrFileChange} />
        </div>
        <div className="form-group">
          <label>Original Code Path:</label>
          <input type="text" value={origPath} onChange={(e) => setOrigPath(e.target.value)} />
          <label>Original Code Filename:</label>
          <input type="file" onChange={handleOrigFileChange} />
        </div>
        <div className="form-group">
          <label>Component Code Modules:</label>
          <textarea value={ccModules} onChange={(e) => setCcModules(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Software/Version#:</label>
          <input type="text" value={softver} onChange={(e) => setSoftver(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Infrastructure:</label>
          <input type="text" value={infra} onChange={(e) => setInfra(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Additional Instructions:</label>
          <textarea value={additionalInstructions} onChange={(e) => setAdditionalInstructions(e.target.value)} />
          <button type="button" onClick={handleCopyRCode}>Copy R version code to the clipboard</button>
        </div>
        <div className="form-group">
          <label>Data Path:</label>
          <input type="text" value={dataInputsPath} onChange={(e) => setDataInputsPath(e.target.value)} />
          <label>Data Input:</label>
          <input type="file" multiple onChange={handleDataInputFilesChange} />
        </div>
        <div className="form-group">
          <label>Data Output Path:</label>
          <input type="text" value={dataOutputPath} onChange={(e) => setDataOutputPath(e.target.value)} />
          <label>Data Output Filename:</label>
          <input type="text" value={dataOutputFilename} onChange={(e) => setDataOutputFilename(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Creation Date:</label>
          <input type="date" value={creationDate} onChange={(e) => setCreationDate(e.target.value)} />
          <label>Version:</label>
          <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} />
          <label>Author Name:</label>
          <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          <label>Author Description:</label>
          <input type="text" value={authorDescription} onChange={(e) => setAuthorDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Validator Name:</label>
          <input type="text" value={validatorName} onChange={(e) => setValidatorName(e.target.value)} />
          <label>Validation Description:</label>
          <input type="text" value={validationDescription} onChange={(e) => setValidationDescription(e.target.value)} />
        </div>
        <button type="submit">Generate</button>
      </form>
      <div className="output">
        <button onClick={handleCopy}>Copy Header</button>
        <pre style={{ fontFamily: "Courier New, monospace" }}>{headerText}</pre>
      </div>
    </div>
  );
};

export default HeaderGenerator;
