import { toast } from "react-toastify"

export const showToast = (message: string, type: "warning" | "error" | "success" = "success") => {
    if (type == "error") {
        return toast.error(message);
    }

    if (type == "warning") {
        return toast.warning(message);
    }

    if (type == "success") {
        return toast.success(message);
    }

}


export const getRelativeTime = (timestamp: any): string => {
    if (!timestamp) return "";

    let date: Date;

    if (timestamp.toDate) {
        // Firestore Timestamp instance
        date = timestamp.toDate();
    } else if (timestamp.seconds) {
        // Serialized Firestore timestamp object
        date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1_000_000);
    } else {
        return "";
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;

    // Older than a week → show formatted date
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};


export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
