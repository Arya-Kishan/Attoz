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