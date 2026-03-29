import Content from "./content";
import useData from "./queries";

export default function BronPage() {
  const { data } = useData({});

  return (
    <>
      <Content data={data?.items || []} />
    </>
  );
}
