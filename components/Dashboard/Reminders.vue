<template>
  <div class="flex-none p-5" style="width:260px;">
    <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer" style="height:120px;">
      <div class="relative">
        <div>
          <span class="float-left py-1 px-2">
            <svgicon name="alert" height="20" width="20"/>
          </span>
          Please complete your
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

