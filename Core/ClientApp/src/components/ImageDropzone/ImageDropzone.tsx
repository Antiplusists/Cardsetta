import {DropzoneAreaBase} from "material-ui-dropzone";
import {InferProps} from 'prop-types';

type ImageDropzoneProps = {
    onAddImage: Function
}

export default function ImageDropzone(props: InferProps<ImageDropzoneProps>) {
    const {onAddImage} = props;
    return (<DropzoneAreaBase
        fileObjects={[]}
        acceptedFiles={['image/jpeg', 'image/jpg', 'image/png']}
        filesLimit={1}
        maxFileSize={1000000}
        showPreviewsInDropzone={false}
        onAdd={onAddImage}
        dropzoneText='Загрузить изображение'
        getFileAddedMessage={(fileName: String) => `Файл ${fileName} успешно добавлен.`}
        getFileLimitExceedMessage={(filesLimit: number) => `Превышено максимально допустимое количество файлов. Разрешено только ${filesLimit}.`}
        getDropRejectMessage={(rejectedFile: File) => `Файл ${rejectedFile.name} был отклонен.`}
        getFileRemovedMessage={(fileName: String) => `Файл ${fileName} был удалён.`}
    />);
}