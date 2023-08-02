import { FC } from "react"
import dynamic from 'next/dynamic'
import CustomImageRenderer from "./renderers/CustomImageRenderer"


interface EditorOutputProps{
    content:any
}

const Output=dynamic(
    async ()=>(await import('editorjs-react-renderer')).default,
    {ssr:false}
)

const style={
    paragraph:{
        fontSize:'0.875rem',
        lineHeight:'1.25rem',
    },
}

const renderers={
    image:CustomImageRenderer,
    // code:CustomCodeRenderer,
}

const EditorOutput:FC<EditorOutputProps> = ({content}) => {
  return (
    <Output
     data={content} style={style} className="text-sm" renderers={renderers}   />
  )
}

export default EditorOutput