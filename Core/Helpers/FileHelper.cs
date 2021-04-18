﻿using System;
using System.IO;

namespace Core.Helpers
{
    public static class FileHelper
    {
        public static string PatchDirectoryName(string dirName, string? baseDirectoryPath = null)
        {
            return Path.GetFullPath(Path.IsPathRooted(dirName) ? dirName : WalkDirectoryTree(dirName, Directory.Exists, baseDirectoryPath));
        }

        private static string WalkDirectoryTree(string filename, Func<string, bool> fileSystemObjectExists, string? baseDirectoryPath = null)
        {
            baseDirectoryPath ??= AppDomain.CurrentDomain.BaseDirectory;
            var baseDirectory = new DirectoryInfo(baseDirectoryPath!);
            while (baseDirectory != null)
            {
                var candidateFilename = Path.Combine(baseDirectory.FullName, filename);
                if (fileSystemObjectExists(candidateFilename))
                    return candidateFilename;
                baseDirectory = baseDirectory.Parent;
            }
            return filename;
        }
    }
}