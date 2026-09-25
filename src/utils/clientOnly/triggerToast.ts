import type { ToastManagerAddOptions } from "@base-ui/react";
import { type ToastData, toast } from "@/src/ui/shadcn/components/ui/toast";

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
    console.log(this.processedOpts);
    return toast.add({
      id: this.id,
      ...this.processedOpts,
    });
  }

  public update(updated_opts: Partial<Partial<Omit<ToastOpts, "id">>>) {
    this.constructData(updated_opts);
    toast.update(this.id, this.processedOpts);
  }

  public close() {
    toast.close(this.id);
  }

  private constructData(opts: Partial<ToastOpts>) {
    this.processedOpts = {
      ...opts,
      data: {
        type: opts?.type,
        hideClose: opts?.hideClose,
      },
    };
  }
}
