$(document).ready(function () {

    function escapeHtml(string) {
        var str = '' + string;
        var match = /["'&<>]/.exec(str);

        if (!match) {
          return str;
        }

        var escape;
        var html = '';
        var index = 0;
        var lastIndex = 0;

        for (index = match.index; index < str.length; index++) {
            switch (str.charCodeAt(index)) {    
                case 34: // "
                  escape = '&quot;';
                  break;
                case 38: // &
                  escape = '&amp;';
                  break;
                case 39: // '
                  escape = '&#39;';
                  break;
                case 60: // <
                  escape = '&lt;';
                  break;
                case 62: // >
                  escape = '&gt;';
                  break;
                default:
                  continue;
            }

            if (lastIndex !== index) {
                html += str.substring(lastIndex, index);
            }

            lastIndex = index + 1;
            html += escape;
        }

        return lastIndex !== index
            ? html + str.substring(lastIndex, index)
            : html;
    }

    var filesArray = [];

    function post2Europass() {
        var data = new FormData();
        var totalFilesIncluded = 0;
        $.each(filesArray, function (i, file) {
            if (
                file.type === "application/pdf" ||
                file.type === "text/xml" ||
                file.type === "application/xml"
            ) {
                data.append("files", file);
                totalFilesIncluded += 1;
            }
        });

        if (!totalFilesIncluded) {
            $(".material-button")[0].innerText = "Send";
            return;
        }

        var request = new XMLHttpRequest();
        request.open("POST", window.location.href + "api/download", true);
        request.responseType = "arraybuffer";
        request.onload = function (e) {
            $(".material-button")[0].innerText = "Send";
            if (this.status === 200) {
                var filename = "";
                var disposition = request.getResponseHeader("Content-Disposition");
                if (disposition && disposition.indexOf("attachment") !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, "");
                    }
                }

                var type = request.getResponseHeader("Content-Type");
                var blob =
                    typeof File === "function"
                        ? new File([this.response], filename, {type: type})
                        : new Blob([this.response], {type: type});

                if (typeof window.navigator.msSaveBlob !== "undefined") {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        // use HTML5 a[download] attribute to specify filename
                        var a = document.createElement("a");
                        // safari doesn't support this yet
                        if (typeof a.download === "undefined") {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 100); // cleanup
                }
            } else {
                try {
                    var error = JSON.parse(
                        new TextDecoder("utf-8").decode(new Uint8Array(request.response))
                    );
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(error.type, "text/xml");
                    var errorCode = xmlDoc.getElementsByTagName("trace")[0].innerHTML;
                    var errorDescription = xmlDoc.getElementsByTagName("message")[0].innerHTML;
                    $("#errors_container")[0].innerHTML =
                        "<p>Error on File :" +
                        escapeHtml(error.file) +
                        "</p><p>" +
                        escapeHtml(errorCode) +
                        "</p><p>" +
                        escapeHtml(errorDescription) +
                        "</p>";
                } catch(err) {
                    $("#errors_container")[0].innerText =
                        "An error occured please try again later";
                    setTimeout(function () {
                        $("#errors_container")[0].innerText = "";
                    }, 5000);
                }

                $(".material-button")[0].innerText = "Send";
            }
        };

        request.send(data);
    }

    let dropArea = document.body;
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        filesArray.push.apply(filesArray, files);
        if (filesArray.length > 0) {
            $(".material-button").attr("disabled", false);
        } else {
            $(".material-button").attr("disabled", true);
        }
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            if (file.type === "application/pdf" || file.type === "text/xml") {
                $(
                    "<div class='file__value'><div class='file__value--text'>" +
                    escapeHtml(file.name) +
                    "</div><div class='file__value--remove' data-id='" +
                    escapeHtml(file.name) +
                    "' ></div></div>"
                ).insertAfter("#file__input");
            } else {
                $(
                    "<div class='file__value'><div class='file__value--text error'>" +
                    escapeHtml(file.name) +
                    "</div><div class='file__value--remove' data-id='" +
                    escapeHtml(file.name) +
                    "' ><span class='tooltiptext'>This is not a Europass Document and It will be ignored</span></div></div>"
                ).insertAfter("#file__input");
            }
        }
    }

    function highlight(e) {
        dropArea.classList.add("highlight");
    }

    function unhighlight(e) {
        dropArea.classList.remove("highlight");
    }

    // ------------  File upload BEGIN ------------
    $(".file__input--file").on("change", function (event) {
        var files = event.target.files;
        handleFiles(files);
    });

    //Click to remove item
    $("body").on("click", ".file__value", function () {
        $(this).remove();
        var fileToRemove = $(this)[0].innerText;
        filesArray = $.grep(filesArray, function (file) {
            return file.name !== fileToRemove;
        });
    });
    // ------------ File upload END ------------
    var taint, d, x, y;
    $(".material-button").click(function (e) {
        if (window._paq) {
            _paq.push(["trackEvent", 'Convert', 'click', 'Convert CV to xlsx']);
        }
        $(this)[0].innerText = "Processing...";
        if ($(this).find(".taint").length == 0) {
            $(this).prepend("<span class='taint'></span>");
        }
        taint = $(this).find(".taint");
        taint.removeClass("drop");
        if (!taint.height() && !taint.width()) {
            d = Math.max($(this).outerWidth(), $(this).outerHeight());
            taint.css({height: d, width: d});
        }
        x = e.pageX - $(this).offset().left - taint.width() / 2;
        y = e.pageY - $(this).offset().top - taint.height() / 2;
        taint.css({top: y + "px", left: x + "px"}).addClass("drop");
        post2Europass();
    });
});



/*ck modal addition*/

window.onload = () => {

    let privacyButton = document.querySelector(".privacy-button");
    let modal = document.querySelector(".modal");
    let closeModal = document.querySelector(".modal-close");

    privacyButton.addEventListener("click", () => {
        modal.classList.toggle("is-active");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.toggle("is-active");
    });
};

