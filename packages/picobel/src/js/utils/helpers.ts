export const parseTime = (seconds: number): string => {
    // Media elements report NaN duration until metadata has loaded.
    if (!Number.isFinite(seconds)) return "0:00";

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

// Extract the final path segment, ignoring any query string or hash.
const getFullFileName = (string: string): string => {
    const path = string.split(/[?#]/)[0];
    return path.replace(/^.*[\\/]/, "");
};

// Get File Type
export const getFileType = (string: string): string => {
    const fullFileName = getFullFileName(string);
    const dotIndex = fullFileName.lastIndexOf(".");
    return dotIndex > 0 ? fullFileName.slice(dotIndex + 1) : "";
};

// Get File Name
export const getFileName = (string: string): string => {
    const fullFileName = getFullFileName(string);
    const dotIndex = fullFileName.lastIndexOf(".");
    return dotIndex > 0 ? fullFileName.slice(0, dotIndex) : fullFileName;
};

export const convertToPercentage = (
    value: number,
    total: number,
    precision = 2
) => {
    return Number(((value / total) * 100).toFixed(precision));
};
