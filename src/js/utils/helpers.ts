export const parseTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60)
        .toFixed(0)
        .toString();

    const secs = Math.floor((seconds % 3600) % 60)
        .toFixed(0)
        .toString()
        .padStart(2, "0");

    let parsedTime = `${mins}:${secs}`;

    if (hours > 0) {
        parsedTime = `${hours}:${mins.padStart(2, "0")}:${secs}`;
    }

    return parsedTime;
};

// Get File Type
export const getFileType = (string: string): string =>
    string.substr((~-string.lastIndexOf(".") >>> 0) + 2);

// Get File Name
export const getFileName = (string: string): string => {
    const fullFileName = string.replace(/^.*[\\/]/, "");
    const withNoExtension = fullFileName.split(".")[0];
    return withNoExtension;
};
