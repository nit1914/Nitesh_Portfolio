type SplitTarget = string | string[] | Element | Element[] | NodeListOf<Element>;

type SplitMode = "chars" | "words" | "lines";

interface SplitTextOptions {
  type?: string;
  linesClass?: string;
}

interface TargetState {
  element: Element;
  html: string;
}

function parseModes(type?: string): Set<SplitMode> {
  const raw = (type ?? "chars").split(",").map((entry) => entry.trim());
  const modes = new Set<SplitMode>();
  raw.forEach((entry) => {
    if (entry === "chars" || entry === "words" || entry === "lines") {
      modes.add(entry);
    }
  });
  if (modes.size === 0) modes.add("chars");
  return modes;
}

function resolveTargets(target: SplitTarget): Element[] {
  if (typeof target === "string") {
    return Array.from(document.querySelectorAll(target));
  }
  if (Array.isArray(target) && target.every((entry) => typeof entry === "string")) {
    return target.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  }
  if (target instanceof Element) {
    return [target];
  }
  return Array.from(target);
}

export class SplitText {
  public chars: HTMLElement[] = [];
  public words: HTMLElement[] = [];
  public lines: HTMLElement[] = [];

  private states: TargetState[] = [];

  constructor(target: SplitTarget, options: SplitTextOptions = {}) {
    const modes = parseModes(options.type);
    const linesClass = options.linesClass ?? "split-line";

    const targets = resolveTargets(target);
    targets.forEach((element) => {
      this.states.push({ element, html: element.innerHTML });
      this.splitElement(element, modes, linesClass);
    });
  }

  revert() {
    this.states.forEach(({ element, html }) => {
      element.innerHTML = html;
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
  }

  private splitElement(element: Element, modes: Set<SplitMode>, linesClass: string) {
    const text = element.textContent ?? "";
    const fragment = document.createDocumentFragment();
    const lineRefs: HTMLElement[] = [];

    if (modes.has("words")) {
      const tokens = text.split(/(\s+)/);
      tokens.forEach((token) => {
        if (token.length === 0) return;
        if (/^\s+$/.test(token)) {
          fragment.appendChild(document.createTextNode(token));
          return;
        }

        const span = document.createElement("span");
        span.className = "split-word";
        span.style.display = "inline-block";
        span.textContent = token;
        fragment.appendChild(span);
        this.words.push(span);
        lineRefs.push(span);
      });
    } else if (modes.has("chars")) {
      Array.from(text).forEach((char) => {
        if (/\s/.test(char)) {
          fragment.appendChild(document.createTextNode(char));
          return;
        }
        const span = document.createElement("span");
        span.className = "split-char";
        span.style.display = "inline-block";
        span.textContent = char;
        fragment.appendChild(span);
        this.chars.push(span);
        lineRefs.push(span);
      });
    }

    element.textContent = "";
    element.appendChild(fragment);

    if (modes.has("lines") && lineRefs.length > 0) {
      this.createLineWrappers(element, lineRefs, linesClass);
    }
  }

  private createLineWrappers(element: Element, refs: HTMLElement[], linesClass: string) {
    const groups = new Map<number, HTMLElement[]>();
    refs.forEach((ref) => {
      const key = ref.offsetTop;
      const group = groups.get(key) ?? [];
      group.push(ref);
      groups.set(key, group);
    });

    const sortedGroups = Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
    sortedGroups.forEach(([, group]) => {
      if (group.length === 0) return;

      const wrapper = document.createElement("div");
      wrapper.className = linesClass;
      wrapper.style.display = "block";
      wrapper.style.overflow = "hidden";

      const range = document.createRange();
      range.setStartBefore(group[0]);
      range.setEndAfter(group[group.length - 1]);

      try {
        range.surroundContents(wrapper);
        this.lines.push(wrapper);
      } catch {
        range.detach();
      }
    });

    if (element instanceof HTMLElement) {
      element.style.display = "block";
    }
  }
}
