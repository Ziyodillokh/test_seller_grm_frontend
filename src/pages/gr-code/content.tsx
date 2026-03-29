
import { useQueryState } from "nuqs";

import { QrBarcodeScanner } from "@/components/scanner";

export default function Content() {
  const [type] = useQueryState("type")
  const [link] = useQueryState('link')
  return (
    <div className='h-[calc(100vh-78px)]'>
      {/* <CodeScanner link={link||'re-report'} type={type || "barcode"} /> */}
      <QrBarcodeScanner  link={link||'transfer'} type={type || "barcode"} />
    </div> 
  )
}
