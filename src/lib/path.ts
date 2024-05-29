export function navigate(path: string, url: URL) {
  const mode = url.searchParams.get("mode");
  const token0 = url.searchParams.get("token0");
  const token1 = url.searchParams.get("token1");
  // preserve the parameters while navigating
  return `${path}${mode ? `/?mode=${url.searchParams.get("mode")}` : ""}`;
  // ? `&token0=${url.searchParams.get("token0")}`
  // : "" + token1
  // ? `&token1=${url.searchParams.get("token1")}`
  // : "";
}
