import toast from "react-hot-toast";

export const confirmToast = (message) =>
  new Promise((resolve) => {
    const toastId = toast.custom(
      (t) => (
        <div
          style={{
            background: "#FFFFFF",
            color: "#111111",
            border: "1px solid rgba(84, 198, 157, 0.5)",
            borderRadius: "12px",
            boxShadow: "0 10px 26px rgba(17, 17, 17, 0.16)",
            padding: "16px",
            minWidth: "280px",
          }}
        >
          <div className="fw-semibold mb-3">{message}</div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-sm rounded-pill"
              style={{ border: "1px solid rgba(84, 198, 157, 0.6)" }}
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
            >
              No
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-pill"
              style={{ backgroundColor: "#54C69D", color: "#111111" }}
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
            >
              Yes, continue
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );

    return toastId;
  });
