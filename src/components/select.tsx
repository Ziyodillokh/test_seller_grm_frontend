

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo({
  value,
  options,
  placeholder,
  onChange,
  className
}: {
  value: string;
  options: 
    {
      value: string;
      label: string;
    }[]
  ;
  placeholder?: string;
  onChange: (value:string) => void;
  className: string;
}) {

  return (
    <Select   onValueChange={onChange} >
      <SelectTrigger className={`w-full ${className && className}`}>
        <SelectValue placeholder={options  ? options.find((framework) => framework?.value == value)?.label
              : placeholder || ""} />
     
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
        {
            options?.map(item => item?.label && item?.value &&
                 <SelectItem    key={item?.value} value={item?.value}>
                    {item?.label}
                </SelectItem>)
        }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
