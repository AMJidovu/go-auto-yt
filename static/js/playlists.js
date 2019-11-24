function addPlaylist() {
  startSpinner("add-playlist-spinner");
  let downloadEntire = document.querySelector('#download-entire-playlist').checked;
  let URL = document.getElementById("playlist-url").value;
  let downloadMode = document.getElementById("download-mode").value;
  let fileExtension = document.getElementById("file-extension").value;
  let downloadQuality = document.getElementById("download-quality").value;
  let downloadPath = document.getElementById("output-path-indicator").innerText;

  let type = "Playlist";

  let playlistData = {
    URL,
    downloadMode,
    fileExtension,
    downloadQuality,
    downloadEntire,
    downloadPath,
    type,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(playlistData),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };

  fetch("/api/add", options)
    .then(res => res.json())
    .then(res => {
      handleResponse(res);
      stopSpinner("add-playlist-spinner");
      getPlaylists()
    });
}

function checkAll() {
  startSpinner("check-all-spinner");
  let channelData = {
    Type: "playlists"
  };

  const options = {
    method: "POST",
    body: JSON.stringify(channelData),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };

  fetch("/api/check-all", options)
      .then(res => res.json())
      .then(res => {
        handleResponse(res);
        stopSpinner("check-all-spinner");
        getPlaylists()
      });
}

function getPlaylists() {
  let channelData = {
    Type: "playlists"
  };

  const options = {
    method: "POST",
    body: JSON.stringify(channelData),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };

  fetch("/api/get", options)
      .then(res => res.json())
      .then(playlists => {
        displayPlaylists(playlists);
        getVersion();
      });
}

function checkPlaylist(id) {
  startSpinner(id+"-spinner");
  let URL = id;
  let downloadMode = document.getElementById("download-mode").value;
  let fileExtension = document.getElementById("file-extension").value;
  let downloadQuality = document.getElementById("download-quality").value;

  let channelData = {
    URL,
    downloadMode,
    fileExtension,
    downloadQuality
  };

  const options = {
    method: "POST",
    body: JSON.stringify(channelData),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };

  fetch("/api/check-playlist", options)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      stopSpinner(id+"-spinner");
      if (res.Type == "Success") {
        if (res.Key == "NO_NEW_VIDEOS") {
          displayWarningMessage(res.Message);
          getPlaylists()
        } else if (res.Key == "NEW_VIDEO_DETECTED") {
          displaySuccessMessage(res.Message);
          getPlaylists()
        }
      } else if (res.Type == "Error") {
        if (res.Key == "ERROR_DOWNLOADING_VIDEO") {
          displayErrorMessage(res.Message);
        }
      }
    });
}

function deletePlaylist(id) {
  let playlistURL = {
    URL: id,
    Type: "Playlist"
  };

  const options = {
    method: "POST",
    body: JSON.stringify(playlistURL),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };

  fetch("/api/delete", options)
    .then(res => res.json())
    .then(res => {
      handleResponse(res);
      getPlaylists()
    });
}

function changeExtension() {
  let downloadMode = document.getElementById("download-mode").value;
  let fileExtensions = document.getElementById("file-extension");
  let downloadQualities = document.getElementById("download-quality");
  let input = document.getElementById("download-path").value;
  if (downloadMode == "Audio Only") {
    document.getElementById("download-path").placeholder = "default: /playlists/%(uploader)s/audio/%(title)s.%(ext)s";
    if (input.length > 0) {
      downloadPathRadio = document.getElementById("custom-download-output").checked;
      youtubedlOutputRadio = document.getElementById("custom-ytdl-output").checked;
      if (downloadPathRadio == true) {
        document.getElementById("output-path-indicator").innerHTML = input + "%(uploader)s/audio/%(title)s.%(ext)s"
      } else if (youtubedlOutputRadio == true) {
        document.getElementById("output-path-indicator").innerHTML = input
      }
    } else {
      document.getElementById("output-path-indicator").innerHTML = "/playlists/%(uploader)s/audio/%(title)s.%(ext)s"
    }

    fileExtensions.options[0].value = "m4a";
    fileExtensions.options[0].text = "m4a";
    fileExtensions.options[1].value = "mp3";
    fileExtensions.options[1].text = "mp3";
    downloadQualities.options[0].value = "best";
    downloadQualities.options[0].text = "best";
    downloadQualities.options[1].value = "medium";
    downloadQualities.options[1].text = "medium";
    downloadQualities.options[2].value = "worst";
    downloadQualities.options[2].text = "worst"

  } else if (downloadMode == "Video And Audio") {
    document.getElementById("download-path").placeholder = "default: /playlists/%(uploader)s/%(playlist)s/audio/%(title)s.%(ext)s";
    if (input.length > 0) {
      let downloadPathRadio = document.getElementById("custom-download-output").checked;
      let youtubedlOutputRadio = document.getElementById("custom-ytdl-output").checked;
      if (downloadPathRadio == true) {
        document.getElementById("output-path-indicator").innerHTML = input + "%(uploader)s/%(playlist)s/audio/%(title)s.%(ext)s"
      } else if (youtubedlOutputRadio == true) {
        document.getElementById("output-path-indicator").innerHTML = input
      }
    } else {
      document.getElementById("output-path-indicator").innerHTML = "%(uploader)s/%(playlist)s/audio/%(title)s.%(ext)s"
    }

    fileExtensions.options[0].value = "any";
    fileExtensions.options[0].text = "any (recommended for now)";
    fileExtensions.options[1].value = "mp4";
    fileExtensions.options[1].text = "mp4";

    downloadQualities.options[0].value = "best";
    downloadQualities.options[0].text = "best";
    downloadQualities.options[1].value = "worst";
    downloadQualities.options[1].text = "worst"
  }
}

function customYtdl(checkboxId) {
  document.getElementById("download-path").disabled = false;
  if (checkboxId == "custom-download-output") {
    document.getElementById("download-path").placeholder = "default: /playlists/"
  } else if (checkboxId == "custom-ytdl-output") {
    document.getElementById("download-path").placeholder = "default: /playlists/%(uploader)s/%(playlist)s/audio/%(title)s.%(ext)s"
  }
}

function changeOutputPathIndicator(id) {
  document.getElementById("output-path-indicator").innerHTML = "";
  let downloadPathRadio = document.getElementById("custom-download-output").checked;
  let youtubedlOutputRadio = document.getElementById("custom-ytdl-output").checked;
  let input = document.getElementById(id).value;
  let downloadMode = document.getElementById("download-mode").value;
  if (downloadMode == "Audio Only") {
    if (downloadPathRadio == true) {
      document.getElementById("output-path-indicator").innerHTML = input + "%(uploader)s/%(playlist)s/audio/%(title)s.%(ext)s"
    } else if (youtubedlOutputRadio == true) {
      document.getElementById("output-path-indicator").innerHTML = input
    }
  } else if (downloadMode == "Video And Audio") {
    if (downloadPathRadio == true) {
      document.getElementById("output-path-indicator").innerHTML = input + "%(uploader)s/%(playlist)s/audio/%(title)s.%(ext)s"
    } else if (youtubedlOutputRadio == true) {
      document.getElementById("output-path-indicator").innerHTML = input
    }
  }
}
