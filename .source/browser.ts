// @ts-nocheck
import { browser } from "fumadocs-mdx/runtime/browser";
import type * as Config from "../source.config";

const create = browser<
  typeof Config,
  import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
    DocData: {};
  }
>();
const browserCollections = {
  docs: create.doc("docs", {
    "configuration/voidshield-json.mdx": () =>
      import(
        "../content/docs/configuration/voidshield-json.mdx?collection=docs"
      ),
    "getting-started/index.mdx": () =>
      import("../content/docs/getting-started/index.mdx?collection=docs"),
    "getting-started/installation.mdx": () =>
      import(
        "../content/docs/getting-started/installation.mdx?collection=docs"
      ),
  }),
};
export default browserCollections;
