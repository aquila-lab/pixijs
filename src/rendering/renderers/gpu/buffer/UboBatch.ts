/** @internal */
export class UboBatch
{
    public data: Float32Array;
    private readonly _minUniformOffsetAlignment: number = 256;

    /**
     * Optional callback invoked immediately when the backing buffer is resized.
     * This allows consumers to react to the new data reference (e.g. update GPU buffers)
     * before any new buffer resources are created with offsets into the grown buffer.
     */
    public onResize?: (data: Float32Array) => void;

    public byteIndex = 0;

    constructor({ minUniformOffsetAlignment }: {minUniformOffsetAlignment: number})
    {
        this._minUniformOffsetAlignment = minUniformOffsetAlignment;
        this.data = new Float32Array(65535);
    }

    public clear(): void
    {
        this.byteIndex = 0;
    }

    public addEmptyGroup(size: number): number
    {
        // update the buffer.. only float32 for now!
        if (size > this._minUniformOffsetAlignment / 4)
        {
            throw new Error(`UniformBufferBatch: array is too large: ${size * 4}`);
        }

        const start = this.byteIndex;

        let newSize = start + (size * 4);

        newSize = Math.ceil(newSize / this._minUniformOffsetAlignment) * this._minUniformOffsetAlignment;

        if (newSize > this.data.length * 4)
        {
            this._resize(newSize);
        }

        this.byteIndex = newSize;

        return start;
    }

    private _resize(newByteSize: number): void
    {
        // Grow buffer by doubling until it can fit the required byte size
        const requiredFloats = Math.ceil(newByteSize / 4);
        let newLength = this.data.length;

        while (newLength < requiredFloats)
        {
            newLength *= 2;
        }

        const newData = new Float32Array(newLength);

        newData.set(this.data);
        this.data = newData;
        this.onResize?.(this.data);
    }

    public addGroup(array: Float32Array): number
    {
        const offset = this.addEmptyGroup(array.length);

        for (let i = 0; i < array.length; i++)
        {
            this.data[(offset / 4) + i] = array[i];
        }

        return offset;
    }

    public destroy()
    {
        this.data = null;
    }
}
