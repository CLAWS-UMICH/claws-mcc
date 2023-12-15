export default interface Message {
    id: number;
    type: string;
    use: 'PUT' | 'DELETE' | 'GET' | 'POST';
    data?: any;
}

