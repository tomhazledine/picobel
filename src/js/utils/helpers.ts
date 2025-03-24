export const parseTime = seconds => {
    const hours = Math.floor(seconds / 3600);

    let mins = Math.floor((seconds % 3600) / 60)
        .toFixed(0)
        .toString();

    let secs = Math.floor((seconds % 3600) % 60)
        .toFixed(0)
        .toString();

    // Left-pad seconds string if needed
    secs = secs >= 10 ? secs : `0${secs}`;

    let parsedTime = `${mins}:${secs}`;

    if (hours > 0) {
        // Left-pad minutes string if needed
        mins = mins >= 10 ? mins : `0${mins}`;
        parsedTime = `${hours}:${mins}:${secs}`;
    }

    return parsedTime;
};

// Get File Type
export const getFileType = string =>
    string.substr((~-string.lastIndexOf(".") >>> 0) + 2);

// Get File Name
export const getFileName = string => {
    const fullFileName = string.replace(/^.*[\\/]/, "");
    const withNoExtension = fullFileName.split(".")[0];
    return withNoExtension;
};
