import Swal from "sweetalert2";

export const showSuccessAlert = async (title: string, text?: string) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 2500,
    showConfirmButton: false,
    background: "var(--surface, #ffffff)",
    color: "var(--heading, #1B2236)",
    customClass: {
      popup: "rounded-2xl border border-theme-border shadow-2xl",
    },
  });
};

export const showErrorAlert = async (title: string, text?: string) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
    confirmButtonColor: "#C23B13",
    background: "var(--surface, #ffffff)",
    color: "var(--heading, #1B2236)",
    customClass: {
      popup: "rounded-2xl border border-theme-border shadow-2xl",
      confirmButton: "rounded-xl px-6 py-2.5 font-bold",
    },
  });
};

export const showConfirmAlert = async (
  title: string,
  text: string,
  confirmButtonText = "Yes, continue"
) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#C23B13",
    cancelButtonColor: "#566074",
    confirmButtonText,
    cancelButtonText: "Cancel",
    background: "var(--surface, #ffffff)",
    color: "var(--heading, #1B2236)",
    customClass: {
      popup: "rounded-2xl border border-theme-border shadow-2xl",
      confirmButton: "rounded-xl px-5 py-2.5 font-bold",
      cancelButton: "rounded-xl px-5 py-2.5 font-bold",
    },
  });
};
