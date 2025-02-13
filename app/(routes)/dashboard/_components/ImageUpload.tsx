"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, Loader2Icon, WandSparkles, X } from 'lucide-react'
import Image from 'next/image'
//@ts-ignore
import uuid4 from "uuid4";
import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import Constants from '@/data/Constants'
import { toast } from 'sonner'
function ImageUpload() {

    const [imageURL, setImageURL] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [model, setModel] = useState<string>();
    const [description, setDescription] = useState<string>();
    const { user } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function uploadImageToCloudinary(imageFile: File): Promise<string> {
        const CLOUDINARY_NAME: string | undefined = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
        const CLOUDINARY_API_KEY: string | undefined = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
      
        if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY) {
          throw new Error("Cloudinary credentials are missing!");
        }
      
        const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`;
      
        // Create a form data object
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "Buildit_AI"); // Replace with your upload preset
        formData.append("api_key", CLOUDINARY_API_KEY ?? ""); // Ensure it's a string
      
        try {
          // Make the POST request to Cloudinary
          const response = await axios.post<{ secure_url: string }>(UPLOAD_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
          // Return the uploaded image URL
          return response.data.secure_url;
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
          throw error;
        }
      }
      
      const OnImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          console.log(files[0]);
      
          try {
            const url: string = await uploadImageToCloudinary(files[0]);
            setImageURL(url);
            setFile(files[0]);
            setPreviewUrl(url);
          } catch (error) {
            console.error("Image upload failed:", error);
          }
        }
      };
      

    const OnConverToCodeButtonClick = async () => {
        if (!file || !model || !description) {
            toast("Select All Field");
            return;
        }
        setLoading(true);
        //Save Image to Firebase
        // const fileName = Date.now() + '.png';
        // const imageRef = ref(storage, "Wireframe_To_Code/" + fileName);
        // await uploadBytes(imageRef, file).then(resp => {
        //     console.log("Image Uploaded...")
        // });

        // const imageUrl = await getDownloadURL(imageRef);
        console.log("imageURL ",imageURL);

        const uid = uuid4();
        console.log(uid);
        // Save Info To Database
        const result = await axios.post('/api/wireframe-to-code', {
            uid: uid,
            description: description,
            imageUrl: imageURL,
            model: model,
            email: user?.email
        });
        if (result.data?.error) {
            console.log("Not Enough credits");
            toast('Not Enough Credits!');
            setLoading(false);
            return;
        }
        setLoading(false);
        router.push('/view-code/' + uid);
    }

    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {!previewUrl ? <div className='p-7 border border-dashed rounded-md shadow-md
                flex flex-col items-center justify-center
                '>
                    <CloudUpload className='h-10 w-10 text-primary' />
                    <h2 className='font-bold text-lg'>Upload Image</h2>

                    <p className='text-gray-400 mt-2'>Click Button Select Wireframe Image </p>
                    <div className='p-5 border border-dashed w-full flex mt-4 justify-center'>
                        <label htmlFor='imageSelect'>
                            <h2 className='p-2 bg-blue-100 font-bold text-primary cursor-pointer rounded-md px-5'>Select Image</h2>
                        </label>

                    </div>
                    <input type="file" id='imageSelect'
                        className='hidden'
                        multiple={false}
                        onChange={OnImageSelect}
                    />

                </div> :
                    <div className='p-5 border border-dashed'>
                        <Image src={previewUrl} alt='preview' width={500} height={500}
                            className='w-full h-[250px] object-contain'
                        />
                        <X className='flex ite justify-end w-full cursor-pointer'
                            onClick={() => setPreviewUrl(null)}
                        />

                    </div>
                }
                <div className='p-7 border shadow-md rounded-lg'>

                    <h2 className='font-bold text-lg'>Select AI Model</h2>
                    <Select onValueChange={(value) => setModel(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select AI Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {Constants?.AiModelList.map((model, index) => (
                                <SelectItem value={model.name} key={index} >
                                    <div className='flex items-center gap-2'>
                                        <Image src={model.icon} alt={model.name} width={25} height={25} />
                                        <h2> {model.name}</h2>
                                    </div>

                                </SelectItem>

                            ))}

                        </SelectContent>
                    </Select>

                    <h2 className='font-bold text-lg mt-7'>Enter Description about your webpage</h2>
                    <Textarea
                        onChange={(event) => setDescription(event?.target.value)}
                        className='mt-3 h-[150px]'
                        placeholder='Write about your web page' />
                </div>
            </div>

            <div className='mt-10 flex items-center justify-center'>
                <Button onClick={OnConverToCodeButtonClick} disabled={loading}>
                    {loading ? <Loader2Icon className=' animate-spin' /> : <WandSparkles />}
                    Convert to Code</Button>
            </div>
        </div>
    )
}

export default ImageUpload