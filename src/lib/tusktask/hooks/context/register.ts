import { ContextActionsRegistry } from "@/src/types/contextBridge";
import { useCallback, useEffect } from "react";

const contextActions: Record<any, any> = {};

/**
 * Register actions from a context to make them available to other contexts
 */
export function useRegisterActions<T extends keyof ContextActionsRegistry>(
  contextName: T,
  actions: ContextActionsRegistry[T]
) {
  useEffect(() => {
    contextActions[contextName] = actions;

    // Cleanup when component unmounts
    return () => {
      delete contextActions[contextName];
    };
  }, [contextName, actions]);
}

/**
 * Get a specific action from another context
 */
export function useCallAction<
  TContext extends keyof ContextActionsRegistry,
  TAction extends keyof ContextActionsRegistry[TContext],
>(
  contextName: TContext,
  actionName: TAction
): ContextActionsRegistry[TContext][TAction] | undefined {
  return useCallback(
    (...args: any[]) => {
      const action = contextActions[contextName]?.[actionName];
      if (typeof action === "function") {
        return (action as Function)(...args);
      }
      console.warn(
        `Action ${String(actionName)} not found in ${String(contextName)} context`
      );
    },
    [contextName, actionName]
  ) as ContextActionsRegistry[TContext][TAction];
}

/**
 * Get all actions from a specific context
 */
export function useContextActions<T extends keyof ContextActionsRegistry>(
  contextName: T
): ContextActionsRegistry[T] | undefined {
  return contextActions[contextName];
}

/**
 * Check if a context has been registered
 */
export function useIsContextRegistered<T extends keyof ContextActionsRegistry>(
  contextName: T
): boolean {
  return useCallback(() => {
    return contextName in contextActions;
  }, [contextName])();
}
