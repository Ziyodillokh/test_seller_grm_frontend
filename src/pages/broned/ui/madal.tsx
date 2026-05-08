
import {  useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader} from '@/components/ui/dialog'



export default function BronsModals() {
  const [carpetType,setCarpetType] = useQueryState("carpetType");
  return (
    <Dialog  onOpenChange={()=>setCarpetType(null)} open={carpetType=="my-broned"? true:false}>
    <DialogContent className='max-w-[300px]'>
        <DialogHeader>
        Bu gilamning bronini bekor qilishni xohlaysizmi?
        </DialogHeader>
        <Button onClick={()=>setCarpetType(null)} className=' h-[62px] text-[15px]'>Ha, to'g'ri!</Button>
    </DialogContent>
  </Dialog>
  )
}
