// Builds the searchable command list for the Ctrl/⌘+K palette and provides the
// fuzzy matcher that ranks results. Navigation commands are derived from the
// same NAV_SECTIONS the sidebar uses, so the palette never drifts out of sync.
import { NAV_SECTIONS, isVisible } from "../dashboard/navItems";

/**
 * Flatten NAV_SECTIONS into navigation commands, carrying the parent group /
 * section for context and merging role restrictions down to each leaf.
 *
 * @param {string|null} role  active user role — used to hide forbidden links
 * @returns {Array} command objects { id, kind, label, group, icon, to, keywords }
 */
export const buildNavCommands = (role) => {
  const commands = [];

  NAV_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      if (!isVisible(item, role)) return;

      const leaves = item.children
        ? item.children.filter((c) => isVisible(c, role))
        : [item];

      leaves.forEach((leaf) => {
        if (!leaf.to) return;
        // A child link inherits its parent group's label for nicer context
        // ("Appointments › Book New" reads better than a bare "Book New").
        const groupLabel = item.children ? item.label : section.heading;

        commands.push({
          id: `nav:${leaf.to}`,
          kind: "nav",
          label: leaf.label,
          group: section.heading,
          context: item.children ? item.label : null,
          icon: leaf.icon,
          to: leaf.to,
          end: leaf.end,
          keywords: [leaf.label, groupLabel, section.heading, leaf.to]
            .join(" ")
            .toLowerCase(),
        });
      });
    });
  });

  return commands;
};

/**
 * Lightweight subsequence fuzzy match with scoring. Returns the matched
 * character indices in `text` (for highlighting) plus a relevance score, or
 * `null` when `query` is not a subsequence of `text`.
 */
export const fuzzyMatch = (query, text) => {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return { score: 0, indices: [] };

  let qi = 0;
  let score = 0;
  let lastHit = -2;
  const indices = [];

  for (let ti = 0; ti < t.length && qi < q.length; ti += 1) {
    if (t[ti] === q[qi]) {
      indices.push(ti);
      // Reward runs of consecutive matches and matches at word boundaries —
      // this is what makes "bn" rank "Book New" above "Boarding".
      score += lastHit === ti - 1 ? 6 : 1;
      if (ti === 0 || /[\s/_-]/.test(t[ti - 1])) score += 10;
      lastHit = ti;
      qi += 1;
    }
  }

  if (qi < q.length) return null;

  if (t.startsWith(q)) score += 20;
  else if (t.includes(q)) score += 12;
  score -= t.length * 0.1; // gently prefer shorter, tighter labels
  return { score, indices };
};

/**
 * Rank `commands` against `query`. With an empty query every command passes
 * through (score 0) so the palette can show the full grouped menu; otherwise
 * each command is scored on its label (for highlight indices) and its broader
 * keyword string (so a path or group name can still surface a hit).
 *
 * @returns {Array} commands decorated with { score, indices } sorted high→low
 */
export const searchCommands = (commands, query) => {
  const q = query.trim();
  if (!q) return commands.map((c) => ({ ...c, score: 0, indices: [] }));

  return commands
    .map((c) => {
      const labelHit = fuzzyMatch(q, c.label);
      const keywordHit = fuzzyMatch(q, c.keywords);
      if (!labelHit && !keywordHit) return null;

      // Highlight only against the visible label; lean on the (lower-weighted)
      // keyword score when the match lives in the path/group instead.
      const indices = labelHit ? labelHit.indices : [];
      const score = labelHit
        ? labelHit.score + 40
        : keywordHit.score;
      return { ...c, score, indices };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
};
