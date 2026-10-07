import type { ToastManagerAddOptions } from "@base-ui/react";
import { type ToastData, toast } from "@/src/ui/shadcn/components/ui/toast";
import { triggerSound } from "./triggerSound";

export type ToastMAO = ToastManagerAddOptions<ToastData>;

export type ToastOpts = {
  trigger?: boolean;
  title: string;
} & ToastData &
  Omit<ToastMAO, "data" | "type" | "title">;

export class Toaster {
  id: string;
  opts: ToastOpts;
  processedOpts: ToastMAO = {};

  constructor(opts: ToastOpts) {
    const id = opts.id ?? crypto.randomUUID();
    const _opts = {
      id,
      ...opts,
    };

    this.id = id;
    this.opts = {
      type: "info",
      ...opts,
      id,
    };

    this.constructData(_opts);

    if (opts.trigger) {
      this.trigger();
    }
  }

  public trigger() {
    switch (this.processedOpts.data?.type) {
      case "error":
        triggerSound("alert_echo", "notification");
        break;
      case "loading":
        break;
      case "success":
        triggerSound("alert_chime", "notification");
        break;
      case "info":
        triggerSound("alert_chime", "notification");
        break;
      case "warning":
        triggerSound("alert_echo", "notification");
        break;
      default:
        triggerSound("alert_chime", "notification");
        break;
    }

    return toast.add({
      id: this.id,
      ...this.processedOpts,
    });
  }

  public update(updated_opts: Partial<Partial<Omit<ToastOpts, "id">>>) {
    this.constructData({
      ...updated_opts,
    });

    toast.update(this.id, {
      ...this.processedOpts,
    });
  }

  public close() {
    toast.close(this.id);
  }

  private constructData(opts: Partial<ToastOpts>) {
    this.processedOpts = {
      ...this.processedOpts,
      ...opts,
      data: {
        type: opts?.type,
        hideClose: opts?.hideClose,
      },
    };
  }
}
