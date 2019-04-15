<template>
    <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer hover:bg-grey-lighter" style="height:120px;">
          <div><slot name="jobs"></slot></div>
          <div class="font-sans text-5xl text-grey-darkest">
              <slot name="total"></slot>
          </div>
        </div>
    </div>
</template>
