import { useSelector } from "react-redux";

export function useLanguage() {
  const language = useSelector((state) => state.labels.language);
  return language;
}
