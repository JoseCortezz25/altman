"use client";
import { Button } from "@/components/ui/button"
import { ChangeEvent, useState } from "react";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string>();
  const { getRootProps, getInputProps } = useDropzone(
    {
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!validMimeType.includes(file.type)) {
          toast.error("Invalid file type. Please upload an image")
          return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      },
    }
  );

  async function fetchAltFromAI() {
    if (!image) {
      toast.error("Please upload an image")
      return;
    }

    try {
      setLoading(true);
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const inputText = process.env.NEXT_PUBLIC_PROMPT;
      if (!inputText) return;

      let imageParts;
      if (Array.isArray(image)) {
        imageParts = await Promise.all(image.map(fileToGenerativePart));
      } else {
        imageParts = [await fileToGenerativePart(image)];
      }
      const result = await model.generateContent([inputText, ...imageParts]);
      const text = result.response.text();

      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  const validMimeType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']

  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(",")[1]);
        } else {
          reject('FileReader result is not a string');
        }
      };
      reader.readAsDataURL(file);
    });

    const base64EncodedData = await base64EncodedDataPromise;
    return {
      inlineData: {
        data: base64EncodedData,
        mimeType: file.type,
      },
    };
  }

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!validMimeType.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image")
      return;
    }

    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onCopy = () => {
    if (data) {
      navigator.clipboard.writeText(data);
      toast("Copied to clipboard")
    }
  };

  return (
    <div className="container mx-auto flex flex-col lg:px-[24px] xl:px-0 pt-[5rem] mb-[8rem]">
      <div className="w-full md:w-[50%] mx-auto flex flex-col items-center">
        <h1 className="text-center text-[4rem] font-bold mt-2">Altman</h1>
        <p className="text-center">Generate alternative texts for your images with AI.</p>


        <div {...getRootProps()} className="w-full h-[120px] mt-[3rem]">
          <input type="file" name="image" id="image" className="hidden" onChange={onImageChange}  {...getInputProps()} />

          <label htmlFor="image" className="w-full h-full">
            <div className="group cursor-pointer h-full">
              <div className="w-full h-full border-[2px] border-dashed border-neutral-200 rounded-lg flex space-x-5 justify-center items-center group-hover:border-neutral-600 transition-all duration-200 ease-in-out">
                <div className="text-neutral-400 group-hover:text-neutral-600 transition-all duration-200 ease-in-out">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75022 16.5002C0.000222408 17.2502 0.750222 9.00024 6.75022 9.75024C4.50022 1.50024 17.2502 1.50024 16.5002 7.50024C24.0002 5.25024 24.0002 17.2502 17.2502 16.5002M8.25022 13.5002L12.0002 10.5002M12.0002 10.5002L15.7502 13.5002M12.0002 10.5002V21.7502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"></path></svg>
                </div>

                <div>
                  <p className="font-semibold text-neutral-400 group-hover:text-neutral-600 transition-all duration-200 ease-in-out">Drag and Drop your image or click to upload here.</p>
                  <p className="text-neutral-400 group-hover:text-neutral-600 transition-all duration-200 ease-in-out">(.png, .jpg, .jpeg, .webp)</p>
                </div>

              </div>
            </div>
          </label>
        </div>

        <div className="mt-[2rem] space-x-5 flex justify-center">
          {imagePreview && (
            <Button onClick={fetchAltFromAI}>
              <div className="size-4 mr-3">
                <svg className="w-ful h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ffffff">
                  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
                </svg>
              </div>
              Generate a stunning alt
            </Button>
          )}

          {imagePreview && (
            <Button variant="secondary" onClick={() => {
              setImage(undefined);
              setImagePreview('');
              setData('');
            }}>Clear</Button>
          )}
        </div>
      </div>

      {imagePreview && (
        <section className="md:w-[90%] mx-auto flex flex-col md:grid grid-cols-2 mt-[50px]">
          <div className="md:p-8 grid place-content-center">
            <img src={imagePreview} alt="Preview image" className="shadow-lg aspect-square lg:aspect-auto lg:max-h-[550px]" />
          </div>
          <div className="mt-8 md:mt-0 md:p-12">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="w-[190px] h-[20px] rounded-full" />
                <Skeleton className="w-[250px] h-[20px] rounded-full" />
                <Skeleton className="w-[90px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[40px] rounded-md inline-block" />
              </div>
            ) : (
              <div>
                <p>{data}</p>
                {data && <Button variant="secondary" className="mt-5" onClick={onCopy}>Copy it</Button>}
              </div>
            )}
          </div>
        </section>
      )}

    </div >
  );
}
