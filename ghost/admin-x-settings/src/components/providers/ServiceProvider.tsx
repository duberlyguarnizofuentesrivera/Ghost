import React from 'react';
import setupGhostApi from '../../utils/api';
import {createContext} from 'react';

export interface FileService {
    uploadImage: (file: File) => Promise<string>;
}
interface ServicesContextProps {
    api: ReturnType<typeof setupGhostApi>;
    fileService: FileService|null
}

interface ServicesProviderProps {
    children: React.ReactNode;
    ghostVersion: string;
}

const ServicesContext = createContext<ServicesContextProps>({
    api: setupGhostApi({ghostVersion: ''}),
    fileService: null
});

const ServicesProvider: React.FC<ServicesProviderProps> = ({children, ghostVersion}) => {
    const apiService = setupGhostApi({ghostVersion});
    const fileService = {
        uploadImage: async (file: File): Promise<string> => {
            const response = await apiService.images.upload({file});
            return response.images[0].url;
        }
    };
    return (
        <ServicesContext.Provider value={{
            api: apiService,
            fileService
        }}>
            {children}
        </ServicesContext.Provider>
    );
};

export {ServicesContext, ServicesProvider};