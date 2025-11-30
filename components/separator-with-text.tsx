export const SeparatorWithText = ({
  text = "Or continue with",
}: {
  text: string;
}) => {
  return (
    <div className="relative w-full my-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-zinc-300"></span>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white dark:bg-background px-2 text-zinc-500 dark:text-gray-300">
          {text}
        </span>
      </div>
    </div>
  );
};
